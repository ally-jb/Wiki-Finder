export default {
    async get(path: string) {
        return new Promise<Response>((resolve, reject) => {
            return fetch(`${path}`).then(async response => {
                    if (response.status === 403) {
                        console.log(' response was 403')
                        reject()
                    }
                    else if (response.status === 401) {
                        console.log(' response was 401')
                        const { url } = await response.json()
                        window.location = url
                        reject()
                    } else {
                        resolve(response)
                    }                    
                }).catch(console.log)
        })
    }
}