// Skip Husky installation in production, CI, or when HUSKY=0
if (
  process.env.NODE_ENV === 'production'
  || process.env.CI === 'true'
  || process.env.HUSKY === '0'
) {
  process.exit(0)
}
const husky = (await import('husky')).default
console.log(husky())
