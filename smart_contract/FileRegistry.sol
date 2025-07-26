// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileRegistry {
    struct FileRecord {
        address uploader;
        uint256 timestamp;
        string ipfsCid;
        string metadata;
    }

    mapping(bytes32 => FileRecord) public files;
    bytes32[] public fileHashes;

    event FileUploaded(bytes32 indexed fileHash, address indexed uploader, uint256 timestamp, string ipfsCid, string metadata);

    function logFileUpload(bytes32 fileHash, string memory ipfsCid, string memory metadata) public {
        require(files[fileHash].timestamp == 0, "File already logged");
        files[fileHash] = FileRecord(msg.sender, block.timestamp, ipfsCid, metadata);
        fileHashes.push(fileHash);
        emit FileUploaded(fileHash, msg.sender, block.timestamp, ipfsCid, metadata);
    }

    function verifyFile(bytes32 fileHash) public view returns (bool exists, address uploader, uint256 timestamp, string memory ipfsCid, string memory metadata) {
        FileRecord memory record = files[fileHash];
        if (record.timestamp == 0) {
            return (false, address(0), 0, "", "");
        }
        return (true, record.uploader, record.timestamp, record.ipfsCid, record.metadata);
    }

    function getAuditTrail() public view returns (bytes32[] memory) {
        return fileHashes;
    }
} 