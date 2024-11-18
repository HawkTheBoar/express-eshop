import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy, mock } from 'jest-mock-extended'
import prisma from './prisma_client'
import { beforeEach } from 'node:test'

jest.mock('./client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>