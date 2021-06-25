import React from "react"
import { Input } from "../styled"

const TextInput = props => {
    return (
        <Input style={{ width: "93%", height: 25, marginLeft: 10, border: "none" }} id={props.id} type={props.type} placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
    )
}

export default TextInput