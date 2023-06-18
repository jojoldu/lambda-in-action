import {getData} from '../app';

describe('React Native App', () => {
  it('getData', () => {
    const data = getData();

    expect(data).toHaveLength(100);
  });
});