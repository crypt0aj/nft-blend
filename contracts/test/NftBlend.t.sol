// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/NftBlend.sol";

contract CounterTest is Test {
    NftBlend public nftBlend;

    address public userAddress;
    address public targetAddress;

    event AddressRegistered(address indexed _address);
    event AddressDeregistered(address indexed _address);
    event BlendMinted(
        uint256 indexed _tokenId,
        address indexed _source,
        address indexed _target,
        uint8 _score,
        string _uri
    );

    function setUp() public {
        nftBlend = new NftBlend();
        userAddress = address(1);
        targetAddress = address(2);
    }

    function testRegister() public {
        assert(!nftBlend.isRegistered(userAddress));

        vm.expectEmit(true, false, false, false);
        emit AddressRegistered(userAddress);

        vm.prank(userAddress);
        nftBlend.register();

        assert(nftBlend.isRegistered(userAddress));
    }

    function testRegisterFail() public {
        vm.prank(userAddress);
        nftBlend.register();

        vm.expectRevert("address already registered");
        vm.prank(userAddress);
        nftBlend.register();
    }

    function testDeregister() public {
        assert(!nftBlend.isRegistered(userAddress));

        vm.prank(userAddress);
        nftBlend.register();

        assert(nftBlend.isRegistered(userAddress));

        vm.expectEmit(true, false, false, false);
        emit AddressDeregistered(userAddress);

        vm.prank(userAddress);
        nftBlend.deregister();

        assert(!nftBlend.isRegistered(userAddress));
    }

    function testDeregisterFail() public {
        vm.expectRevert("address not registered");
        vm.prank(userAddress);
        nftBlend.deregister();
    }

    function testMint() public {
        vm.prank(userAddress);
        nftBlend.register();

        vm.prank(targetAddress);
        nftBlend.register();

        vm.expectEmit(true, true, true, true);
        emit BlendMinted(
            1,
            userAddress,
            targetAddress,
            98,
            "http://localhost:8080/image.jpg"
        );

        vm.prank(userAddress);
        uint256 tokenId = nftBlend.mint(
            targetAddress,
            98,
            "http://localhost:8080/image.jpg"
        );

        (
            address source,
            address target,
            uint8 score,
            string memory uri
        ) = nftBlend.getMetadata(tokenId);

        assertEq(source, userAddress);
        assertEq(target, targetAddress);
        assertEq(score, 98);
        assertEq(uri, "http://localhost:8080/image.jpg");
    }

    function testMintFailSameSourceAndTarget() public {
        vm.prank(userAddress);
        nftBlend.register();

        vm.expectRevert("source and target address cannot be same");
        vm.prank(userAddress);
        nftBlend.mint(userAddress, 98, "http://localhost:8080/image.jpg");
    }

    function testMintFailSourceUnregistered() public {
        vm.prank(targetAddress);
        nftBlend.register();

        vm.expectRevert("source address is not registered");
        vm.prank(userAddress);
        nftBlend.mint(targetAddress, 98, "http://localhost:8080/image.jpg");
    }

    function testMintFailTargetUnregistered() public {
        vm.prank(userAddress);
        nftBlend.register();

        vm.expectRevert("target address is not registered");
        vm.prank(userAddress);
        nftBlend.mint(targetAddress, 98, "http://localhost:8080/image.jpg");
    }

    function testMintFailHighScore() public {
        vm.prank(userAddress);
        nftBlend.register();

        vm.prank(targetAddress);
        nftBlend.register();

        vm.expectRevert("score cannot be greater than 100");
        vm.prank(userAddress);
        nftBlend.mint(targetAddress, 101, "http://localhost:8080/image.jpg");
    }

    function testGetMetadataFailUnminted() public {
        vm.expectRevert("ERC721: invalid token ID");
        nftBlend.getMetadata(0);
    }

    function testCounterIncrement() public {
        vm.prank(userAddress);
        nftBlend.register();

        vm.prank(targetAddress);
        nftBlend.register();

        vm.prank(userAddress);
        uint256 tokenId = nftBlend.mint(
            targetAddress,
            98,
            "http://localhost:8080/image.jpg"
        );

        assertEq(tokenId, 1);

        vm.prank(targetAddress);
        uint256 newTokenId = nftBlend.mint(
            userAddress,
            98,
            "http://localhost:8080/image.jpg"
        );

        assertEq(newTokenId, 2);
    }

    function testTokenUri() public {
        vm.prank(userAddress);
        nftBlend.register();

        vm.prank(targetAddress);
        nftBlend.register();

        vm.prank(userAddress);
        uint256 tokenId = nftBlend.mint(
            targetAddress,
            98,
            "http://localhost:8080/image.jpg"
        );

        string memory tokenUri = nftBlend.tokenURI(tokenId);

        assertEq(tokenUri, "http://localhost:8080/image.jpg");
    }

    function testTokenUriFailUnminted() public {
        vm.expectRevert("ERC721: invalid token ID");
        nftBlend.tokenURI(0);
    }
}
