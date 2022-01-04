import chai, { expect } from 'chai'
import { Contract } from 'ethers'
import { solidity, MockProvider, createFixtureLoader } from 'ethereum-waffle'
import { BigNumber, bigNumberify } from 'ethers/utils'

import { expandTo18Decimals, mineBlock, encodePrice } from './shared/utilities'
import { treasuryFixture } from './shared/fixtures'
import { AddressZero } from 'ethers/constants'

const MINIMUM_LIQUIDITY = bigNumberify(10).pow(3)

chai.use(solidity)

const overrides = {
    gasLimit: 9999999
}

describe('CybarTreasury', () => {
    const provider = new MockProvider({
        hardfork: 'istanbul',
        mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
        gasLimit: 9999999
    })
    const [wallet, lottery, other] = provider.getWallets()
    const loadFixture = createFixtureLoader(provider, [wallet, lottery])

    let treasury: Contract
    let factory: Contract
    let cybarToken: Contract
    let token0: Contract
    let token1: Contract
    let pair0: Contract
    let pair1: Contract
    let pair2: Contract

    beforeEach(async () => {
        const fixture = await loadFixture(treasuryFixture)
        treasury = fixture.treasury
        factory = fixture.factory
        cybarToken = fixture.cybarToken
        token0 = fixture.token0
        token1 = fixture.token1
        pair0 = fixture.pair0
        pair1 = fixture.pair1
        pair2 = fixture.pair2
    })

    it('Constructor tests', async () => {
        expect(await treasury.cybarToken()).to.eq(cybarToken.address)
        expect(await treasury.cybarFactory()).to.eq(factory.address)
        expect(await treasury.lpToken(0)).to.eq(pair0.address)
        expect(await treasury.lpToken(1)).to.eq(pair1.address)
        expect(await treasury.lpToken(2)).to.eq(pair2.address)
        expect(await treasury.checkLPToken(pair0.address)).to.eq(true)
        expect(await treasury.checkLPToken(pair1.address)).to.eq(true)
        expect(await treasury.checkLPToken(pair2.address)).to.eq(true)
        expect(await treasury.checkLPToken(token0.address)).to.eq(false)
        expect(await treasury.checkLPToken(token1.address)).to.eq(false)
    })

    it('Access tests', async () => {
        expect(treasury.connect(other).transferOwnership(other.address)).to.revertedWith("Treasury: Can only be called by owner")
        expect(treasury.connect(other).setLottery(other.address)).to.revertedWith("Treasury: Can only be called by owner")

    })
})
