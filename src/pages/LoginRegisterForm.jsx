import React, { useState } from 'react'
import { supabase } from '../supabase/supabaseClient'
import '../styles/LoginRegister.css'

export default function LoginRegisterForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (isRegistering) {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

      if (existingUser) {
        setMessage('Username is already taken.')
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      })

      if (error) {
        setMessage(error.message)
        return
      }

      setMessage('Success! Check your email to confirm your account.')
      setEmail('')
      setPassword('')
      setUsername('')
    } else {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        setMessage(loginError.message)
        return
      }

      const user = loginData.user

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!profile) {
        const usernameFromMeta = user.user_metadata?.username || ''

        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, username: usernameFromMeta }])

        if (insertError) {
          setMessage('Login ok, but failed to create profile.')
          return
        }
      }

      setMessage('Login successful!')
      onLogin()
    }
  }

  return (
    <div className="auth-form">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <p>
        {isRegistering ? 'Already have an account?' : 'Need an account?'}{' '}
        <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Login' : 'Register'}
        </button>
      </p>
      {message && <p>{message}</p>}
    </div>
  )
}
