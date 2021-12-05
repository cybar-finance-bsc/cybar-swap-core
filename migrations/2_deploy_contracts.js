const CybarERC20 = artifacts.require("CybarERC20");
const ERC20 = artifacts.require("ERC20");
const Dummy = artifacts.require("DummyToken");
const CybarFactory = artifacts.require("CybarFactory");
const CybarPair = artifacts.require("CybarPair");

module.exports = async function(deployer, network, accounts) {
    let walletAddress, cybarAddress;
    if( network == "development"){
        walletAddress = accounts[0];
    } else if (network == "fantomTestnet") {
        walletAddress = "0xf469818b50D0d7aFC2dd29050a3d5dc87C645438";
        cybarAddress = "0x5500f1D0993A666f5CD9dCE434762309Df257A9f";
        await deployer.deploy(Dummy);
        const dummy = await Dummy.deployed();
        await deployer.deploy(ERC20, 1000000000);
        const wftm = await ERC20.deployed();
        await deployer.deploy(CybarFactory, walletAddress);
        const cybarFactory = await CybarFactory.deployed();
        cybarFactory.createPair(cybarAddress, wftm.address);
        cybarFactory.createPair(cybarAddress, dummy.address);
        cybarFactory.createPair(wftm.address, dummy.address);
    }
};

