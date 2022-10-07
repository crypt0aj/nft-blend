// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin/token/ERC721/ERC721.sol";
import "openzeppelin/utils/Counters.sol";

contract NftBlend is ERC721 {
    // Token ID counter
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Metadata of a blend
    struct BlendMetadata {
        // Source address of a blend
        address source;
        // Target address of a blend
        address target;
        // Score of a blend (should be between 0 and 100)
        uint8 score;
        // URI pointing to blend
        string uri;
    }

    // Mapping of registered addresses
    mapping(address => bool) private registeredAddresses;

    // Mapping of tokenId => BlendMetadata
    mapping(uint256 => BlendMetadata) private blendMetadatas;

    // Event emitted when a new address registers
    event AddressRegistered(address indexed _address);

    // Event emitted when an address de-registers
    event AddressDeregistered(address indexed _address);

    // Event emitted when a new blend is minted
    event BlendMinted(
        uint256 indexed _tokenId,
        address indexed _source,
        address indexed _target,
        uint8 _score,
        string _uri
    );

    // Constructor for NftBlend contract
    constructor() ERC721("NftBlend", "BLND") {
        _tokenIds.increment(); // Set initial value of counter to 1
    }

    // Registers a new address
    function register() public {
        require(!isRegistered(msg.sender), "address already registered");
        registeredAddresses[msg.sender] = true;
        emit AddressRegistered(msg.sender);
    }

    // Checks if an address is registered
    function isRegistered(address userAddress) public view returns (bool) {
        return registeredAddresses[userAddress];
    }

    // De-registers an address
    function deregister() public {
        require(isRegistered(msg.sender), "address not registered");
        registeredAddresses[msg.sender] = false;
        emit AddressDeregistered(msg.sender);
    }

    // Mints a new blend
    function mint(
        address _target,
        uint8 _score,
        string memory _uri
    ) public returns (uint256) {
        require(
            msg.sender != _target,
            "source and target address cannot be same"
        );
        require(isRegistered(msg.sender), "source address is not registered");
        require(isRegistered(_target), "target address is not registered");
        require(_score <= 100, "score cannot be greater than 100");

        uint256 newTokenId = _tokenIds.current();
        _mintBlend(newTokenId, msg.sender, _target, _score, _uri);

        emit BlendMinted(newTokenId, msg.sender, _target, _score, _uri);

        _tokenIds.increment();
        return newTokenId;
    }

    // Returns the metadata for a token id
    function getMetadata(uint256 _tokenId)
        public
        view
        returns (
            address _source,
            address _target,
            uint8 _score,
            string memory _uri
        )
    {
        _requireMinted(_tokenId);

        BlendMetadata memory metadata = blendMetadatas[_tokenId];

        return (metadata.source, metadata.target, metadata.score, metadata.uri);
    }

    // Override the tokenURI function from ERC721 spec
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        _requireMinted(tokenId);
        return blendMetadatas[tokenId].uri;
    }

    // Internal function to mint the blend
    function _mintBlend(
        uint256 _tokenId,
        address _source,
        address _target,
        uint8 _score,
        string memory _uri
    ) private {
        _safeMint(_source, _tokenId);

        blendMetadatas[_tokenId] = BlendMetadata(
            _source,
            _target,
            _score,
            _uri
        );
    }
}
