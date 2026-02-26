import { describe, it, expect, jest } from '@jest/globals';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthForm } from './AuthForm';
import { I18nProvider } from '@/i18n/I18nProvider';

describe('AuthForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnOAuthLogin = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnOAuthLogin.mockClear();
  });

  it('renders login form correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <I18nProvider>
        <AuthForm type="login" onSubmit={mockOnSubmit} onOAuthLogin={mockOnOAuthLogin} />
      </I18nProvider>
    );

    expect(getByText('ログイン')).toBeTruthy();
    expect(getByPlaceholderText('メールアドレス')).toBeTruthy();
    expect(getByPlaceholderText('パスワード')).toBeTruthy();
    expect(getByText('ログイン')).toBeTruthy(); // Button text
    expect(() => getByPlaceholderText('パスワード確認')).toThrow(); // Should not be present
  });

  it('renders signup form correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <I18nProvider>
        <AuthForm type="signup" onSubmit={mockOnSubmit} onOAuthLogin={mockOnOAuthLogin} />
      </I18nProvider>
    );

    expect(getByText('新規登録')).toBeTruthy();
    expect(getByPlaceholderText('メールアドレス')).toBeTruthy();
    expect(getByPlaceholderText('パスワード')).toBeTruthy();
    expect(getByPlaceholderText('パスワード確認')).toBeTruthy();
    expect(getByText('新規登録')).toBeTruthy(); // Button text
  });

  it('calls onSubmit with correct credentials for login', async () => {
    const { getByPlaceholderText, getByText } = render(
      <I18nProvider>
        <AuthForm type="login" onSubmit={mockOnSubmit} onOAuthLogin={mockOnOAuthLogin} />
      </I18nProvider>
    );

    fireEvent.changeText(getByPlaceholderText('メールアドレス'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('パスワード'), 'password123');
    fireEvent.press(getByText('ログイン'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('calls onSubmit with correct credentials for signup', async () => {
    const { getByPlaceholderText, getByText } = render(
      <I18nProvider>
        <AuthForm type="signup" onSubmit={mockOnSubmit} onOAuthLogin={mockOnOAuthLogin} />
      </I18nProvider>
    );

    fireEvent.changeText(getByPlaceholderText('メールアドレス'), 'newuser@example.com');
    fireEvent.changeText(getByPlaceholderText('パスワード'), 'newpassword123');
    fireEvent.changeText(getByPlaceholderText('パスワード確認'), 'newpassword123');
    fireEvent.press(getByText('新規登録'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith('newuser@example.com', 'newpassword123');
    });
  });

  it('shows error for empty fields on login', async () => {
    const { getByText } = render(
      <I18nProvider>
        <AuthForm type="login" onSubmit={mockOnSubmit} onOAuthLogin={mockOnOAuthLogin} />
      </I18nProvider>
    );

    fireEvent.press(getByText('ログイン'));

    await waitFor(() => {
      expect(getByText('メールアドレスとパスワードを入力してください。')).toBeTruthy();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('shows error for invalid email format', async () => {
    const { getByPlaceholderText, getByText } = render(
      <I18nProvider>
        <AuthForm type="login" onSubmit={mockOnSubmit} onOAuthLogin={mockOnOAuthLogin} />
      </I18nProvider>
    );

    fireEvent.changeText(getByPlaceholderText('メールアドレス'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('パスワード'), 'password123');
    fireEvent.press(getByText('ログイン'));

    await waitFor(() => {
      expect(getByText('有効なメールアドレスを入力してください。')).toBeTruthy();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('shows error for password mismatch on signup', async () => {
    const { getByPlaceholderText, getByText } = render(
      <I18nProvider>
        <AuthForm type="signup" onSubmit={mockOnSubmit} onOAuthLogin={mockOnOAuthLogin} />
      </I18nProvider>
    );

    fireEvent.changeText(getByPlaceholderText('メールアドレス'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('パスワード'), 'password123');
    fireEvent.changeText(getByPlaceholderText('パスワード確認'), 'differentpassword');
    fireEvent.press(getByText('新規登録'));

    await waitFor(() => {
      expect(getByText('パスワードが一致しません。')).toBeTruthy();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('shows error for password too short on signup', async () => {
    const { getByPlaceholderText, getByText } = render(
      <I18nProvider>
        <AuthForm type="signup" onSubmit={mockOnSubmit} onOAuthLogin={mockOnOAuthLogin} />
      </I18nProvider>
    );

    fireEvent.changeText(getByPlaceholderText('メールアドレス'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('パスワード'), 'short');
    fireEvent.changeText(getByPlaceholderText('パスワード確認'), 'short');
    fireEvent.press(getByText('新規登録'));

    await waitFor(() => {
      expect(getByText('パスワードは8文字以上である必要があります。')).toBeTruthy();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('calls onOAuthLogin with "Google" when Google button is pressed', async () => {
    const { getByText } = render(
      <I18nProvider>
        <AuthForm type="login" onSubmit={mockOnSubmit} onOAuthLogin={mockOnOAuthLogin} />
      </I18nProvider>
    );

    fireEvent.press(getByText('Googleでログイン'));
    expect(mockOnOAuthLogin).toHaveBeenCalledTimes(1);
    expect(mockOnOAuthLogin).toHaveBeenCalledWith('Google');
  });

  it('calls onOAuthLogin with "Apple" when Apple button is pressed', async () => {
    const { getByText } = render(
      <I18nProvider>
        <AuthForm type="login" onSubmit={mockOnSubmit} onOAuthLogin={mockOnOAuthLogin} />
      </I18nProvider>
    );

    fireEvent.press(getByText('Appleでログイン'));
    expect(mockOnOAuthLogin).toHaveBeenCalledTimes(1);
    expect(mockOnOAuthLogin).toHaveBeenCalledWith('Apple');
  });
});

