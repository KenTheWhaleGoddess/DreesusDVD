pragma solidity ^0.8.7;


import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "solady/src/utils/LibString.sol";
import "solady/src/utils/Base64.sol";
enum SaleState {
    NOSALE, PUBLICSALE
}

contract TestNFT is ERC721A('abc', 'OTH'), Ownable {
    using LibString for uint256;
  
    string artUri = "https://d38aca3d381g9e.cloudfront.net/";   

    uint256 public price = .01 ether;
    uint256 public maxSupply = 5555;

    mapping(uint256 => bool) hitsCorner;

    SaleState public saleState = SaleState.NOSALE;

    address constant WG = 0x41538872240Ef02D6eD9aC45cf4Ff864349D51ED;
    address constant DREESUS;

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId),"ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(
            'data:application/json;base64,', Base64.encode(bytes(abi.encodePacked(
                        '{"name": "DVD #', _tokenId.toString(), 
                        '", "description":"', 
                        "DVD logo test.",
                        '", "animation_url": "', 
                        '"image":"',
                        artUri,
                        "office.png",
                        '",',
                        artUri, 
                        _tokenId.toString(), '.html'
                        '",',
                        '"attributes": [{',
                        '"trait_type": "corner", "value": "',
                        hitsCorner[_tokenId] ? "True" : "False",
                        '"}]}')))));
    }

    function publicMint(uint256 count) external payable {
        require(msg.value >= (price * count), "not sending enough ether for mint");
        require(totalSupply() + count <= maxSupply);
        require(saleState == SaleState.PUBLICSALE, "Not in public sale");
        //require(count < 6, "mint is max 5 only");
        _safeMint(msg.sender, count);
    }

    function ownerMint(address _user, uint256 _count) external onlyOwner {
        require(totalSupply() + _count <= maxSupply);
        _safeMint(_user, _count);
    }

    function setSaleState(SaleState newSaleState) external onlyOwner {
        saleState = newSaleState;
    }

    function setPrice(uint256 newPrice) external onlyOwner {
        price = newPrice;
    }

    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        maxSupply = newMaxSupply;
    }

    function setArtUri(string memory _newArtUri) external onlyOwner {
        artUri = _newArtUri;
    }

    function getSaleState() external view returns (uint256) {
        return uint256(saleState);
    }

    function setCorner(uint256[] memory tokens, bool val) external onlyOwner {
        for(uint i = 0; i < tokens.length; i++) {
            hitsCorner[tokens[i]] = val;
        }
    }

    function withdrawEth() external {
        payable(WG).call{value: address(this).balance / 5}('');
        payable(DREESUS).call{value: address(this).balance}('');
    }
}
