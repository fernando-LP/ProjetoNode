const token = localStorage.getItem("token")

const axiosConfig = {
    headers:{
        Authorization:"Bearer " + token
    }
}

export default axiosConfig

