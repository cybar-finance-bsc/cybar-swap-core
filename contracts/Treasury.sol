pragma solidity = 0.5.16;

import './interfaces/ITreasury.sol';
import './interfaces/ICybarERC20.sol';
import './interfaces/ICybarFactory.sol';
import './interfaces/ICybarPair.sol';

import './libraries/SafeMath.sol';

contract Treasury is ITreasury {
    using SafeMath for uint;

    address public cybarToken;
    address public cybarFactory;
    address lottery;
    address owner;
    address[] public lpToken;
    mapping(address => bool) public checkLPToken;

    modifier onlyOwner(){
        require(msg.sender==owner, 'Treasury: Can only be called by owner');
        _;
    }

    modifier onlyOwnerOrLottery(){
        require(msg.sender==owner || msg.sender==lottery, 'Treasury: Can only be called by owner or lottery');
        _;
    }

    constructor(address _cybarFactory, address _cybarToken, address _lottery) public {
        cybarFactory = _cybarFactory;
        cybarToken = _cybarToken;
        lottery = _lottery;
        owner = msg.sender;
    }

    function addLPToken(address _lpToken) external onlyOwner{
        require(!checkLPToken[_lpToken], 'LP token already in list');
        checkLPToken[_lpToken] = true;
        lpToken.push(_lpToken);
    }

    function buyCybar() external onlyOwnerOrLottery{
        for(uint8 i=0; i<lpToken.length; i++){
            if(ICybarERC20(lpToken[i]).balanceOf(address(this))>0){
                buyCybarWithToken(lpToken[i]);
            }
        }
    }

    function buyCybarWithToken(address _lpToken) internal onlyOwnerOrLottery{
        address token0 = ICybarPair(_lpToken).token0();
        address token1 = ICybarPair(_lpToken).token1();
        (uint256 amount0, uint256 amount1) = ICybarPair(_lpToken).burn(address(this));
        address lpPair;
        if(token0!=cybarToken){
            (address tokenA, address tokenB) = sortToken(token0, cybarToken);
            lpPair = ICybarFactory(cybarFactory).getPair(tokenA, tokenB);
            (uint reservesA, uint reservesB,) = ICybarPair(lpPair).getReserves();
            (uint reservesIn, uint reservesOut) = tokenA == cybarToken ? (reservesB, reservesA) : (reservesA, reservesB);
            uint amountOut = getAmountOut(amount0, reservesIn, reservesOut);
            (uint amountAOut, uint amountBOut) = tokenA == cybarToken ? (amountOut, uint(0)) : (uint(0), amountOut);
            ICybarPair(lpPair).swap(amountAOut, amountBOut, address(this), new bytes(0));
        }
        if(token1!=cybarToken){
            (address tokenA, address tokenB) = sortToken(token1, cybarToken);
            lpPair = ICybarFactory(cybarFactory).getPair(tokenA, tokenB);
            (uint reservesA, uint reservesB,) = ICybarPair(lpPair).getReserves();
            (uint reservesIn, uint reservesOut) = tokenA == cybarToken ? (reservesB, reservesA) : (reservesA, reservesB);
            uint amountOut = getAmountOut(amount1, reservesIn, reservesOut);
            (uint amountAOut, uint amountBOut) = tokenA == cybarToken ? (amountOut, uint(0)) : (uint(0), amountOut);
            ICybarPair(lpPair).swap(amountAOut, amountBOut, address(this), new bytes(0));
        }
    }

    function transferOwnership(address _newOwner) external onlyOwner{
        owner = _newOwner;
    }

    function setLottery(address _newLottery) external onlyOwner{
        lottery = _newLottery;
    }

    function sortToken(address tokenA, address tokenB) internal pure returns(address token0, address token1){
        require(tokenA!=tokenB, 'Tokens must be different');
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'One Token is the zero address');
    }

    function getAmountOut(uint amountIn, uint reservesIn, uint reservesOut) internal pure returns(uint amountOut){
        require(amountIn > 0, 'Treasury: insufficient input amount');
        require(reservesIn > 0 && reservesOut > 0, 'Treasury: insufficient liquidity');
        uint amountInWithFee = amountIn.mul(998);
        uint numerator = amountInWithFee.mul(reservesOut);
        uint denominator = reservesIn.mul(1000).add(amountInWithFee);
        return numerator / denominator;
    }
}
