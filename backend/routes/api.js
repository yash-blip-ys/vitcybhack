const express = require('express');
const router = express.Router();
const { FileModel } = require('../services/db');
const { logFileUpload, verifyFile, getAuditTrail } = require('../services/contract');
const { sha256, generateAccessKey, hashAccessKey } = require('../services/hash');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

// Store file in GridFS and return the file id
async function uploadToGridFS(buffer, filename) {
  const db = mongoose.connection.db;
  const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  const uploadStream = bucket.openUploadStream(filename);
  uploadStream.end(buffer);
  return new Promise((resolve, reject) => {
    uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
    uploadStream.on('error', reject);
  });
}

router.post('/submit', async (req, res) => {
  try {
    const { user, file, metadata } = req.body;
    const fileBuffer = Buffer.from(file.content, 'base64');
    const fileHash = sha256(fileBuffer);
    const accessKey = generateAccessKey();
    const accessKeyHash = hashAccessKey(accessKey);

    // Upload to GridFS
    const gridFsId = await uploadToGridFS(fileBuffer, file.filename);

    // Log to MongoDB
    const dbEntry = await FileModel.create({
      fileHash,
      gridFsId,
      accessKey: accessKeyHash,
      metadata,
      uploader: user.email,
      timestamp: Date.now()
    });

    // Log to Smart Contract
    const txHash = await logFileUpload('0x' + fileHash, gridFsId, JSON.stringify(metadata));

    res.json({ success: true, fileHash, gridFsId, txHash, dbId: dbEntry._id, accessKey });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { file } = req.body;
    if (!file || !file.content) {
      return res.status(400).json({ success: false, error: 'No file content provided' });
    }
    
    const fileBuffer = Buffer.from(file.content, 'base64');
    const fileHash = sha256(fileBuffer);
    
    try {
      // Convert the hash to a bytes32 hex string with 0x prefix
      const hexHash = '0x' + fileHash;
      
      // Verify the file with the contract
      const result = await verifyFile(hexHash);
      
      // If the result is an array, destructure it
      if (Array.isArray(result)) {
        const [exists, uploader, timestamp, gridFsId, metadata] = result;
        return res.json({ 
          exists, 
          uploader, 
          timestamp: timestamp.toString(),
          gridFsId,
          metadata: metadata ? JSON.parse(metadata) : null
        });
      }
      
      // If it's an object (unlikely but handling just in case)
      return res.json({
        exists: result.exists,
        uploader: result.uploader,
        timestamp: result.timestamp.toString(),
        gridFsId: result.gridFsId,
        metadata: result.metadata ? JSON.parse(result.metadata) : null
      });
    } catch (verifyError) {
      console.error('Verification error:', verifyError);
      // If the file doesn't exist in the contract, return exists: false instead of 500
      if (verifyError.message.includes('File not found') || verifyError.message.includes('invalid arrayify value')) {
        return res.json({ 
          exists: false,
          uploader: null,
          timestamp: 0,
          gridFsId: null,
          metadata: null
        });
      }
      throw verifyError;
    }
  } catch (err) {
    console.error('Error in /api/verify:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to verify file',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Secure file access route
router.post('/access', async (req, res) => {
  try {
    const { fileHash, accessKey } = req.body;
    
    if (!fileHash || !accessKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'File hash and access key are required' 
      });
    }

    console.log('Access request for file hash:', fileHash);
    
    const fileDoc = await FileModel.findOne({ fileHash });
    if (!fileDoc) {
      console.log('File not found for hash:', fileHash);
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    const hashedKey = hashAccessKey(accessKey);
    if (fileDoc.accessKey !== hashedKey) {
      console.log('Invalid access key for file:', fileHash);
      return res.status(403).json({ 
        success: false, 
        error: 'Invalid access key' 
      });
    }

    // Stream file from GridFS
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    
    try {
      const downloadStream = bucket.openDownloadStream(
        new mongoose.Types.ObjectId(fileDoc.gridFsId)
      );
      
      // Set appropriate headers
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="file_${fileHash.slice(0, 8)}"`
      });
      
      // Handle stream errors
      downloadStream.on('error', (error) => {
        console.error('Error streaming file:', error);
        if (!res.headersSent) {
          res.status(500).json({ 
            success: false, 
            error: 'Error streaming file' 
          });
        }
      });
      
      // Pipe the file to the response
      downloadStream.pipe(res);
      
    } catch (error) {
      console.error('Error accessing file in GridFS:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error accessing file' 
      });
    }
    
  } catch (err) {
    console.error('Error in /api/access:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.get('/audit', async (req, res) => {
  try {
    const hashes = await getAuditTrail();
    res.json({ hashes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router; 