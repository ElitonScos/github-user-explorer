const mockGet = jest.fn();

const axiosMock = {
  create: jest.fn(() => ({ get: mockGet })),
  get: mockGet,
};

axiosMock.__mockGet = mockGet;

module.exports = axiosMock;
module.exports.default = axiosMock;
