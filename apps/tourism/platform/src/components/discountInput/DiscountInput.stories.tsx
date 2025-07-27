import { DiscountInput, TDiscountInputProps } from '.';

const Story = {
  title: 'Components/DiscountInput',
  component: DiscountInput,
};

export function Default(args: TDiscountInputProps) {
  return <DiscountInput {...args} />;
}

Default.args = {
  name: 'test-input',
};

export default Story;
