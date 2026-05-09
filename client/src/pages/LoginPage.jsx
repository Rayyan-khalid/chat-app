import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  const [currState, setCurrState] = useState('Sign up') 
  const [fullName, setFullName] = useState('') 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (event)=>{
    event.preventDefault();

    if(currState === 'Sign up' && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }
    login(currState=== "Sign up" ? 'signup' : 'login', {fullName, email, password, bio})
  }
  
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col'>

      {/* ------ LEFT ------- */}
      <img src={assets.logo_big} alt="" className='w-[200px] md:w-[250px]'/>

      {/* ------ RIGHT ------- */}

      <form onSubmit={onSubmitHandler} className='flex flex-col w-[340px] p-5 gap-5 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl text-white'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}
        </h2>

        {currState === 'Sign up' && !isDataSubmitted &&(
          <input onChange={(e) => setFullName(e.target.value)} value={fullName}
            type="text" 
            className='p-2 text-sm bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-300' placeholder='Full Name' required/>
        )}

          {/* Email and Password */}
        {!isDataSubmitted && (
          <>
            <input onChange={(e) => setEmail(e.target.value)} value={email}
              type="email" 
              className='p-2 text-sm bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-300' placeholder='Email' required/>

            <input onChange={(e) => setPassword(e.target.value)} value={password}
              type="password" 
              className='p-2 text-sm bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-300' placeholder='Password' required/>
          </>
        )}

        {/* Bio State */}
        {currState === 'Sign up' && !isDataSubmitted && (
            <textarea onChange={(e) => setBio(e.target.value)} value={bio} rows={4} className='p-2 text-sm bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-300 resize-none ' placeholder='provide a short bio...' required></textarea>
          )
        }

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currState === 'Sign up' ? 'Create Account' : 'Login Now'}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy...</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === 'Sign up' ? (
            <p className='text-sm text-gray-500'>Already have an account? <span onClick={() => {setCurrState('Login'); setIsDataSubmitted(false)}} className='text-violet-500 cursor-pointer'>Login Now</span></p>
          ) : (
            <p className='text-sm text-gray-500'>Don't have an account? <span onClick={() => {setCurrState('Sign up'); setIsDataSubmitted(false)}} className='text-violet-500 cursor-pointer'>Sign up</span></p> 
          )}
        </div>

      </form>
    </div>
  )
}

export default LoginPage
