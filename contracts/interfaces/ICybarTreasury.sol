pragma solidity =0.5.16;

interface ICybarTreasury {
    event TokenSwapped(address indexed lptoken, uint256 amount);

    function addLPToken(address _lpToken) external;
    function buyCybar() external;
    function transferOwnership(address _newOner) external;
    function setLottery(address _newLottery) external;
}
