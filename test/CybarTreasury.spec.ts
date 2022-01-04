import chai, { expect } from 'chai'
import { Contract } from 'ethers'
import { solidity, MockProvider, createFixtureLoader } from 'ethereum-waffle'
import { BigNumber, bigNumberify } from 'ethers/utils'

import { expandTo18Decimals, mineBlock, encodePrice } from './shared/utilities'
import { treasuryFixture } from './shared/fixtures'
import { Address Zero } from 'ethers/contract'

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
    const [wallet, other] = provider.getWallets()
    const loadFixture = createFixtureLoader(provider, [wallet])

    let factory: Contract
    let cybarToken: Contract
    let token0: Contract
    let token1: Contract
    let pair0: Contract
    let pair1: Contract

    beforeEach(async () => {
        const fixture = await loadFixture(treasuryFixture)
        factory = fixture.factory
        cybarToken = fixture.cybarToken
        token0 = fixture.token0
        token1 = fixture.token1
        pair0 = fixture.pair0
        pair1 = fixture.pair1

    })
})
