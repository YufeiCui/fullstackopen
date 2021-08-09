const palindrome = require('../utils/for_testing').palindrome

test('Palindrome of empty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test('Palindrome of a single character', () => {
  const result = palindrome('z')

  expect(result).toBe('z')
})

test('palindrome of releveler', () => {
  const result = palindrome('releveler')

  expect(result).toBe('releveler')
})