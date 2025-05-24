import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, AlertCircle, Eye, EyeOff, Lock, Key, Smartphone } from 'lucide-react';
import { useStrongholdStore, type PasswordStorageOption } from '@/stores/stronghold-store';
import { cn } from '@/lib/utils';

interface StrongholdPasswordDialogProps {
  open: boolean;
  onSuccess?: () => void;
}

const storageOptions = [
  {
    value: 'never' as PasswordStorageOption,
    label: 'Ask every time',
    description: 'Most secure - password is never stored',
    icon: Lock,
  },
  {
    value: 'session' as PasswordStorageOption,
    label: 'Remember for this session',
    description: 'Password is kept until you close the app',
    icon: Key,
  },
  {
    value: 'os-keychain' as PasswordStorageOption,
    label: 'Save in system keychain',
    description: 'Stored securely by your operating system',
    icon: Smartphone,
  },
];

export function StrongholdPasswordDialog({ 
  open, 
  onSuccess 
}: StrongholdPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNewVault, setIsNewVault] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [storageOption, setStorageOption] = useState<PasswordStorageOption>('never');
  const [loading, setLoading] = useState(false);
  
  const { initializeStronghold, error, isInitialized } = useStrongholdStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNewVault && password !== confirmPassword) {
      return;
    }

    if (password.length < 8) {
      return;
    }

    setLoading(true);
    try {
      await initializeStronghold(password, storageOption);
      setPassword('');
      setConfirmPassword('');
      onSuccess?.();
    } catch (err) {
      console.error('Failed to initialize Stronghold:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={open} modal>
      <DialogContent className="sm:max-w-[525px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <DialogTitle>Secure Vault Access</DialogTitle>
          </div>
          <DialogDescription>
            {isNewVault 
              ? "Create a strong password to protect your encryption keys. This password will be required to access your encrypted data."
              : "Enter your password to unlock the secure vault and access your encrypted data."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">
              {isNewVault ? 'Create Password' : 'Password'}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pr-10"
                autoFocus
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {isNewVault && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                minLength={8}
              />
            </div>
          )}

          <div className="space-y-3">
            <Label>Password Storage</Label>
            <RadioGroup 
              value={storageOption} 
              onValueChange={(value) => setStorageOption(value as PasswordStorageOption)}
            >
              {storageOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.value} className="flex items-start space-x-3">
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <Label 
                      htmlFor={option.value} 
                      className={cn(
                        "flex-1 cursor-pointer space-y-1",
                        "hover:opacity-80 transition-opacity"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isNewVault && password && confirmPassword && password !== confirmPassword && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Passwords do not match</AlertDescription>
            </Alert>
          )}

          {password && password.length < 8 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Password must be at least 8 characters</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2">
            {!isInitialized && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsNewVault(!isNewVault)}
                disabled={loading}
              >
                {isNewVault ? 'I have a password' : 'Create new vault'}
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={
                loading || 
                !password || 
                password.length < 8 ||
                (isNewVault && (!confirmPassword || password !== confirmPassword))
              }
            >
              {loading ? 'Unlocking...' : isNewVault ? 'Create Vault' : 'Unlock Vault'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
