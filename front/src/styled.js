import styled from "styled-components"

export const Page = styled.div`
    width:100%;
    padding:20px;
    background-color:#EFEFEA;
    padding:0px 20px;
    display:flex;
    flex-direction:column;
`

export const UserArea = styled.div`
    width: 60%;
    display:flex;
    background-color:#FFF;
    border-radius:10px;
    padding:10px;
    margin-top:10px;
    flex-direction:column;
    align-items:center;
    border:1px solid #c6c6c6;
`

export const FooterArea = styled.div`
    width:60%;
    display:flex;
    flex-direction:row;
    justify-content:center;
    
`

export const Button = styled.button`
    width:100px;
    border-radius:5px;
    height:30px;
    border:1px solid white;
    color:#fff;
    margin-right:10px;
    background-color:${(props) => props.bgcolor};
    cursor:pointer;
`
export const AuthArea = styled.div`
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
`

export const Input = styled.input`
    width:93%;
    height:25px;
    margin-left:10px;
    border:none;
`

export const InputArea = styled.div`
    align-items:center;
    width:50%;
    height:35px;
    margin-bottom:15px;
    border:1px solid #000;
    display:flex;
    flex-direction:row;
    padding-left:10px;
    border-radius:10px;
    background-color:#fff;
`

export const ButtonContainer = styled.div`
    justify-content: center;
    width: 50%;
    display: flex; 
`
export const Img = styled.img`
    width:30px;
    height:20px;
    margin-right:10px;
`