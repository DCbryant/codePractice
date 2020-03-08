export const delay = (ms1: number, ms2: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Math.random())
    }, ms1 + ms2)
  })
}

export function readFile(filename: string, callback: any) {
  setTimeout(() => {
    callback(null, filename)
  }, 1000)
}