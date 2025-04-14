import React from 'react';
import { BsGithub, BsInstagram, BsLinkedin } from "react-icons/bs";

const HeaderSocial = () => {
  return (
    <div className='header__socials'>
      <a href="https://linkedin.com/in/ganeth-seetsi-531098168/" target='_blank' rel="noreferrer" ><BsLinkedin/></a>
      <a href="https://instagram.com/ganeth14/" target='_blank' rel="noreferrer"><BsInstagram /></a>
      <a href="https://github.com/seetsi1997/" target='_blank' rel="noreferrer"><BsGithub /></a>
    </div>
  )
}

export default HeaderSocial