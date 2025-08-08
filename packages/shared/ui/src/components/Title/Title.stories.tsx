import { Meta, StoryObj } from '@storybook/react';
import Title from './Title';
import { TypographyColor } from '../../types/typography';

const meta: Meta<typeof Title> = {
  title: 'Components/Title',
  component: Title,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: [
        'large',
        'large-medium',
        'medium-bold',
        'medium',
        'small-bold',
        'small',
        'too-small',
        'too-small-bold',
      ],
    },
    color: {
      control: { type: 'select' },
      options: ['onSurface', 'onPrimary'] as TypographyColor[],
    },
    children: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Title>;

export const Default: Story = {
  render: (args) => <Title {...args} />,
  args: {
    children: 'عنوان پیش‌فرض',
    size: 'medium',
    color: 'onSurface',
  },
};

export const LargeBold: Story = {
  render: (args) => <Title {...args} />,
  args: {
    children: 'عنوان بزرگ',
    size: 'large-medium',
    color: 'onSurface',
  },
};
