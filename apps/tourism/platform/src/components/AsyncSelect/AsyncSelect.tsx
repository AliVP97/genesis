import ReactSelectAsyncSelect from 'react-select/async';

import { Control, ValueContainer, SingleValueOption, MultiValueOption } from './components';

export const AsyncSelect: ReactSelectAsyncSelect = ({
  placeholder = '',
  styles,
  components,
  ...props
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <ReactSelectAsyncSelect
        placeholder={placeholder}
        loadingMessage={() => 'در حال جستجو'}
        noOptionsMessage={() => 'گزینه ای موجود نیست'}
        components={{
          // @ts-expect-error
          Control,
          // @ts-expect-error
          ValueContainer,
          // @ts-expect-error
          Option: props.isMulti ? MultiValueOption : SingleValueOption,
          ...components,
        }}
        hideSelectedOptions={false}
        isSearchable={false}
        defaultOptions
        isRtl
        styles={{
          control: (styles) => ({
            ...styles,
            height: 64,
            paddingInline: 16,
            border: 'none',
            borderRadius: 16,
            backgroundColor: '#F3F3F3',
          }),
          option: (styles, state) => ({
            ...styles,
            display: 'flex',
            alignItems: 'center',
            columnGap: 6,
            color: '#121516',
            backgroundColor: state.isSelected ? 'white' : '#F3F3F3',
            borderBottom: '1px solid #696A6B',
          }),
          placeholder: (styles) => ({
            ...styles,
            fontSize: '14px',
            color: '#212529',
          }),
          dropdownIndicator: (styles) => ({
            ...styles,
            marginTop: '0px !important',
            color: '#212529',
          }),
          valueContainer: (styles) => ({
            ...styles,
            marginTop: 12,
            fontSize: 14,
            color: '#696A6B',
          }),
          indicatorsContainer: (styles) => ({
            ...styles,
            marginTop: '0px !important',
          }),
          multiValue: (styles) => ({ ...styles, marginTop: '0px !important' }),
          menuList: (styles) => ({ ...styles, padding: 0 }),
          indicatorSeparator: (styles) => ({ ...styles, display: 'none' }),
          multiValueRemove: (styles) => ({ ...styles, display: 'none' }),
          clearIndicator: (styles) => ({ ...styles, display: 'none' }),
          ...styles,
        }}
        {...props}
      />
    </div>
  );
};
