import React from 'react'

const FormGroup = ({lable,placeholder,value,onChange}) => {
  return (
   <div className="form-group">
        <label htmlFor="email">{lable}</label>
        <input 
        value={value}
        onChange={onChange}
        type="email" id='email' name='email' placeholder={placeholder} required />
    </div>
  )
}

export default FormGroup
