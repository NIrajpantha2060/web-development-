/**
 * Form Validation Tests
 * Tests form validation logic and user interactions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// ============================================
// Test Utility: Email Validation
// ============================================
describe('Email Validation', () => {
  const validateEmail = (email) => {
    if (!email || !email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid';
    return null;
  };

  it('should return error for empty email', () => {
    expect(validateEmail('')).toBe('Email is required');
  });

  it('should return error for whitespace-only email', () => {
    expect(validateEmail('   ')).toBe('Email is required');
  });

  it('should return error for invalid email format', () => {
    expect(validateEmail('invalid-email')).toBe('Email is invalid');
  });

  it('should return error for email without domain', () => {
    expect(validateEmail('user@')).toBe('Email is invalid');
  });

  it('should return error for email without @', () => {
    expect(validateEmail('userdomain.com')).toBe('Email is invalid');
  });

  it('should return null for valid email', () => {
    expect(validateEmail('user@example.com')).toBeNull();
  });

  it('should accept valid email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBeNull();
  });
});

// ============================================
// Test Utility: Password Validation
// ============================================
describe('Password Validation', () => {
  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  it('should return error for empty password', () => {
    expect(validatePassword('')).toBe('Password is required');
  });

  it('should return error for short password', () => {
    expect(validatePassword('12345')).toBe('Password must be at least 6 characters');
  });

  it('should return null for valid password', () => {
    expect(validatePassword('password123')).toBeNull();
  });

  it('should accept password with exactly 6 characters', () => {
    expect(validatePassword('123456')).toBeNull();
  });
});

// ============================================
// Test Utility: Phone Number Validation
// ============================================
describe('Phone Number Validation', () => {
  const validatePhoneNumber = (phone) => {
    if (!phone) return 'Phone number is required';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) return 'Phone number must be 10 digits';
    return null;
  };

  it('should return error for empty phone', () => {
    expect(validatePhoneNumber('')).toBe('Phone number is required');
  });

  it('should return error for short phone number', () => {
    expect(validatePhoneNumber('12345')).toBe('Phone number must be 10 digits');
  });

  it('should return null for valid 10-digit phone', () => {
    expect(validatePhoneNumber('1234567890')).toBeNull();
  });

  it('should handle formatted phone numbers', () => {
    expect(validatePhoneNumber('(123) 456-7890')).toBeNull();
  });
});

// ============================================
// Test: Form State Management
// ============================================
describe('Form State Management', () => {
  const createFormState = (initialValues = {}) => {
    let values = { ...initialValues };
    let errors = {};
    
    return {
      getValues: () => values,
      getErrors: () => errors,
      setValue: (name, value) => {
        values[name] = value;
      },
      setError: (name, error) => {
        errors[name] = error;
      },
      clearError: (name) => {
        delete errors[name];
      },
      reset: () => {
        values = { ...initialValues };
        errors = {};
      },
      hasErrors: () => Object.keys(errors).length > 0
    };
  };

  it('should initialize with default values', () => {
    const form = createFormState({ email: '', password: '' });
    expect(form.getValues()).toEqual({ email: '', password: '' });
  });

  it('should update values correctly', () => {
    const form = createFormState({ email: '' });
    form.setValue('email', 'test@example.com');
    expect(form.getValues().email).toBe('test@example.com');
  });

  it('should track errors', () => {
    const form = createFormState({});
    form.setError('email', 'Email is required');
    expect(form.getErrors().email).toBe('Email is required');
    expect(form.hasErrors()).toBe(true);
  });

  it('should clear errors', () => {
    const form = createFormState({});
    form.setError('email', 'Email is required');
    form.clearError('email');
    expect(form.getErrors().email).toBeUndefined();
    expect(form.hasErrors()).toBe(false);
  });

  it('should reset form to initial state', () => {
    const form = createFormState({ email: '', password: '' });
    form.setValue('email', 'test@example.com');
    form.setError('password', 'Required');
    form.reset();
    expect(form.getValues()).toEqual({ email: '', password: '' });
    expect(form.hasErrors()).toBe(false);
  });
});

// ============================================
// Simple Form Component Test
// ============================================
describe('Simple Form Component', () => {
  // Create a simple test form component
  const TestForm = ({ onSubmit }) => {
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!email) {
        setError('Email is required');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Email is invalid');
        return;
      }
      setError('');
      onSubmit({ email });
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="email-input"
        />
        {error && <span data-testid="error-message">{error}</span>}
        <button type="submit" data-testid="submit-btn">Submit</button>
      </form>
    );
  };

  // Import React for the component
  let React;
  
  beforeEach(async () => {
    React = await import('react');
  });

  it('should show error when submitting empty form', async () => {
    const handleSubmit = vi.fn();
    render(<TestForm onSubmit={handleSubmit} />);
    
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Email is required');
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should show error for invalid email', async () => {
    const handleSubmit = vi.fn();
    render(<TestForm onSubmit={handleSubmit} />);
    
    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Email is invalid');
    });
  });

  it('should call onSubmit with valid email', async () => {
    const handleSubmit = vi.fn();
    render(<TestForm onSubmit={handleSubmit} />);
    
    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });
});
