import { useState } from 'react'
import { supabase } from './supabaseClient'
import './LoginRegister.css'

export default function LoginRegisterForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    let result
    if (isRegistering) {
      result = await supabase.auth.signUp({ email, password })
    } else {
      result = await supabase.auth.signInWithPassword({ email, password })
    }

    if (result.error) {
      setMessage(result.error.message)
    } else {
      setMessage('Success! Check email if registering.')
      onLogin()
    }
  }

  return (
    <div className="auth-form">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <p>
        {isRegistering ? 'Already have an account?' : 'Need an account?'}{' '}
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Login' : 'Register'}
        </button>
      </p>
      {message && <p>{message}</p>}
    </div>
  )
}
