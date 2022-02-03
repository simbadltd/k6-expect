jest.mock('k6', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    namedExport: jest.fn(),
}));