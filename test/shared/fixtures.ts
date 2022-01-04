import { Contract, Wallet } from 'ethers'
import { Web3Provider } from 'ethers/providers'
import { deployContract } from 'ethereum-waffle'

import { expandTo18Decimals } from './utilities'

import ERC20 from '../../build/ERC20.json'
import CybarFactory from '../../build/CybarFactory.json'
import CybarPair from '../../build/CybarPair.json'

interface FactoryFixture {
  factory: Contract
}

const overrides = {
  gasLimit: 9999999
}

export async function factoryFixture(_: Web3Provider, [wallet]: Wallet[]): Promise<FactoryFixture> {
  const factory = await deployContract(wallet, CybarFactory, [wallet.address], overrides)
  return { factory }
}

interface PairFixture extends FactoryFixture {
  token0: Contract
  token1: Contract
  pair: Contract
}

export async function pairFixture(provider: Web3Provider, [wallet]: Wallet[]): Promise<PairFixture> {
  const { factory } = await factoryFixture(provider, [wallet])

  const tokenA = await deployContract(wallet, ERC20, [expandTo18Decimals(10000)], overrides)
  const tokenB = await deployContract(wallet, ERC20, [expandTo18Decimals(10000)], overrides)

  await factory.createPair(tokenA.address, tokenB.address, overrides)
  const pairAddress = await factory.getPair(tokenA.address, tokenB.address)
  const pair = new Contract(pairAddress, JSON.stringify(CybarPair.abi), provider).connect(wallet)

  const token0Address = (await pair.token0()).address
  const token0 = tokenA.address === token0Address ? tokenA : tokenB
  const token1 = tokenA.address === token0Address ? tokenB : tokenA

  return { factory, token0, token1, pair }
}

export async function treasuryFixture(provider: Web3Provider, [wallet]: Wallet[]): Promise<TreasuryFixture> {
    
    const { factory } = await factoryFixture(provider, [wallet])

    const cybarToken = await deployContract(wallet, ERC20, [expandTo18Decimals(10000)], overrides)
    const tokenA = await deployContract(wallet, ERC20, [expandTo18Decimals(10000)], overrides)
    const tokenB = await deployContract(wallet, ERC20, [expandTo18Decimals(10000)], overrides)

    await factory.createPair(cybarToken.address, tokenA.address, overrides)
    await factory.createPair(tokenA.address, tokenB.address, overrides)
    const pairAddress0 = await factory.getPair(cybarToken.address, tokenA.address)
    const pairAddress1 = await factory.getPair(tokenA.address, tokenB.address)
    const pair0 = new Contract(pairAddress0, JSON.stringify(CybarPair.abi), provider).connect(wallet)
    const pair1 = new Contract(pairAddress1, JSON.stringify(CybarPair.abi), provider).connect(wallet)

    const token0Address = (await pair.token0()).address
    const token0 = tokenA.address === token0Address ? tokenA : tokenB
    const token1 = tokenA.address === token0Address ? tokenB : tokenA

    return { factory, cybarToken, token0, token1, pair0, pair1 }
}
