import React from 'react'

const FormGroup = ({lable,placeholder}) => {
  return (
   <div className="form-group">
        <label htmlFor="email">{lable}</label>
        <input type="email" id='email' name='email' placeholder={placeholder} required />
    </div>
  )
}

export default FormGroup
