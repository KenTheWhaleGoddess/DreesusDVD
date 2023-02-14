pragma solidity ^0.8.7;

import "erc721a/contracts/IERC721A.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "solady/src/utils/LibString.sol";
import "solady/src/utils/Base64.sol";
contract CornersToken is ERC1155(''), Ownable {
    using LibString for uint256;
  
    string artUri = "https://d38aca3d381g9e.cloudfront.net/corners/";   

    IERC721A public oldDvds = IERC721A(0xe692582fb12C3e85B3b2E29a94a2F3beFbCEC78B);
    address public constant BURN = 0x000000000000000000000000000000000000dEaD;

    function uri(uint256 _tokenId) public view virtual override returns (string memory) {
        return string(abi.encodePacked(
            'data:application/json;base64,', Base64.encode(bytes(abi.encodePacked(
                        '{"name": "Loading... #', _tokenId.toString(), 
                        '", "description":"', 
                        "Now that I have your attention...",
                        '","image":"',
                        artUri,
                        "corner",
                        _tokenId.toString(),
                        ".png",
                        '", "animation_url": "', 
                        artUri, 
                        _tokenId.toString(), '.html'
                        '",',
                        '"attributes": [{',
                        '"trait_type": "corner", "value": "',
                        "???",
                        '"}]}')))));
    }

    function burnToRedeem(uint[] memory oldTokensToBurn) external {
        require(oldTokensToBurn.length == 25, "only 25 allowed!");

        for(uint i; i < 25; ++i) {
            oldDvds.safeTransferFrom(msg.sender, BURN, oldTokensToBurn[i]);
        }
        _mint(msg.sender, uint256(keccak256(abi.encodePacked(msg.sender, block.number)))% 2, 1, '');
    }

    function setArtUri(string memory _newArtUri) external onlyOwner {
        artUri = _newArtUri;
    }
    function setOldDvds(address _newOldDvds) external onlyOwner {
        oldDvds = IERC721A(_newOldDvds);
    }

    function name() external pure returns (string memory) {
        return "All Corners!";
    }
    function symbol() external pure returns (string memory) {
        return "DVD";
    }
}
