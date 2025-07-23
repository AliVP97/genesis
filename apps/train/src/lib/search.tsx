import { Button } from '@780/ui';

export function Search() {
  return (
    <div>
      <h1>Welcome to Train Search!</h1>
      <Button
        className="p-2 bg-amber-300"
        onClick={() => console.log('CLICKED!!')}
      >
        Click me
      </Button>
    </div>
  );
}
