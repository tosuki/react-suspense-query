const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: {
        name: "Carlos",
        surname: "Henrique"
      }})
    }, 3000)
  })
}

const SUSPENSE_PROMISE_STATUS: Record<string, number> = {
  PENDING: 0,
  SUCCESS: 1,
  ERROR: 2
}

const wrapPromise = (promise: Promise<any>) => {
  let status: number = SUSPENSE_PROMISE_STATUS.PENDING
  let result: any = null

  const suspender = promise.then(
    (response) => {
      status = SUSPENSE_PROMISE_STATUS.SUCCESS
      result = response
    },
    (error) => {
      status = SUSPENSE_PROMISE_STATUS.ERROR
      result = error
    }
  )

  throw promise
}

const main = () => {
  try {
    const wrapped = wrapPromise(fetchData())

    
  } catch (error: any) {
    if (typeof error ==="object" && "then" in error) {
      console.log("Promise is still pending...")
      return error.then((value: any) => {
        console.log("Promise resolved with value:", value)
      }, (err: any) => {
        console.log("Promise rejected with error:", err)
      })
    }

    console.log(error)
  }
}

main()