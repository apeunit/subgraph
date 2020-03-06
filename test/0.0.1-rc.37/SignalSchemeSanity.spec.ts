import {
    getOptions,
    getWeb3,
    sendQuery,
    writeProposalIPFS,
  } from './util';

jest.setTimeout(30000);

const SignalScheme = require('./SignalSchemeABI.json');

const maintest = async (web3, opts, proposalIPFSData, matchto) => {

    const signalSchemeMock = new web3.eth.Contract(SignalScheme.abi,
                                                   '0xD179D86D5EA20Fc0b2302d0a8Fd538f2Ee01E8D3',
                                                   opts);
    /* const signalContract = await signalSchemeMock.deploy({
      data: SignalScheme.bytecode,
      arguments: []
    }).send() */
    // console.log(signalSchemeMock.options.address, signalSchemeMock.address);
    let descHash = await writeProposalIPFS(proposalIPFSData);

    // console.log(signalSchemeMock.methods.signal(descHash).encodeABI());
    await signalSchemeMock.methods.signal(descHash).send();

    const metaq = `{
        signals{
          id
          data
        }
      }`;

    const metadata = await sendQuery(metaq, 15000);
    expect(metadata).toMatchObject(matchto);

  };

  /**
   * Skipping the test for now
   */
describe.skip('Generic Signal Scheme', () => {
    let web3;
    let opts;

    beforeAll(async () => {
      web3 = await getWeb3();
      opts = await getOptions(web3);
    });

    it('generic scheme proposal generate ', async () => {

      let proposalIPFSData = {
        description: 'Setting new header Image',
        title: 'New Header Image',
        url: 'https://w.wallhaven.cc/full/13/wallhaven-13mk9v.jpg',
        key: 'Header',
        value: 'https://w.wallhaven.cc/full/13/wallhaven-13mk9v.jpg',
      };

      let matchto = {
        signals: [
          {
            data:
              '{"Header":"https://w.wallhaven.cc/full/13/wallhaven-13mk9v.jpg"}',
            id:
              '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
          },
        ],
      };

      await maintest(web3, opts, proposalIPFSData, matchto);

    }, 100000);

  });
