import { useContext } from 'react';


export default function Footer(props){
    function displayYear() {
        return new Date().getFullYear()
    }
    
    return(
        <Footer className='footer'>
        Copyright @ 2023 Llajta Solutions Todos los derechos reservados
        </Footer>
    )
}