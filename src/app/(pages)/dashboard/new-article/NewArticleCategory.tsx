import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CgAsterisk } from 'react-icons/cg';
import { NewArticleSchemaType } from './NewArticleSchema';

const categories = [
  { value: 'technology', label: 'Technology' },
  { value: 'science', label: 'Science' },
  { value: 'health', label: 'Health' },
  { value: 'business', label: 'Business' },
];

export const RequiredLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <FormLabel className="flex items-center gap-1">
    {children}
    <CgAsterisk className="h-3 w-3 text-destructive" aria-hidden="true" />
  </FormLabel>
);

export const NewArticleCategoryAndTags: React.FC = () => {
  const { control, setValue, watch } = useFormContext<NewArticleSchemaType>();
  const tags = watch('tags') || [];

  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim(); // Trim whitespace from the input
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const currentTags = watch('tags') || [];
      setValue('tags', [...currentTags, trimmedTag]); // Set the new tags array directly
      setInput(''); // Clear the input field after adding the tag
    } else if (!trimmedTag) {
      console.warn('Cannot add an empty tag.'); // Optional: Add a warning for empty tags
    }
  };

  const removeTag = (indexToRemove: number) => {
    setValue(
      'tags',
      tags.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Category and Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel>Design Category</RequiredLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.value}
                          value={category.value
                            .toLowerCase()
                            .replace(/\s+/g, '_')}
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormLabel>Tags</FormLabel>
            <div className="mb-2 flex flex-wrap gap-2">
              {tags
                .filter((tag) => tag.trim() !== '') // Filter out empty string tags
                .map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-2 py-1 text-sm"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="ml-1 h-auto p-0"
                      onClick={() => removeTag(index)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag} tag</span>
                    </Button>
                  </Badge>
                ))}
            </div>

            <div className="flex gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag..."
                className="flex-grow"
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => addTag(input)}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
