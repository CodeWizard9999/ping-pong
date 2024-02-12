import { toNumbersDifference } from '../src/utils';

describe('utils', () => {
  it.each`
    firstNumber      | secondNumber        | result         
    ${1}             | ${4}                | ${3}      
    ${5}             | ${2}                | ${3} 
    ${1}             | ${1}                | ${0}      
    ${17}            | ${15}               | ${2}
    ${0}             | ${0}                | ${0}
    ${3}             | ${2}                | ${1}
  `('should return $result difference for $firstNumber and $secondNumber', async ({ result, firstNumber, secondNumber }) => {
    expect(toNumbersDifference(firstNumber, secondNumber)).toBe(result);
  });
});
