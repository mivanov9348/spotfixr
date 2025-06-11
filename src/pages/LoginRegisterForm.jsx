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
      // Проверка дали username вече съществува
      const { data: existingUser, error: usernameError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

      if (existingUser) {
        setMessage('Username is already taken.')
        return
      }

      // Регистрация в Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
        return
      }

      const user = data?.user

      // Добавяне на username в таблицата profiles
      if (user) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, username }])

        if (insertError) {
          setMessage('Registration failed when saving username.')
          return
        }
      }

      setMessage('Success! Check your email to confirm your account.')
    } else {
      // Вход само с email и парола
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Login successful!')
        onLogin()
      }
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
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Login' : 'Register'}
        </button>
      </p>
      {message && <p>{message}</p>}
    </div>
  )
}
