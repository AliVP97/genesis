import { City } from '../../types';
import Image from 'next/image';

export const Introduction = ({ data }: { data: City }) => {
  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-column my-4 mx-5">
        <span className="text-weight-700 text-6 my-5" style={{ textAlign: 'center' }}>
          {data.intro.title}
        </span>
        <span
          style={{
            textAlign: 'justify',
            lineHeight: '1.8rem',
          }}
        >
          {data.intro.description}
        </span>
      </div>
      {data.info.map((item, index) => {
        return (
          <div
            className="d-flex flex-lg-row flex-md-column my-5 mx-5 align-items-center"
            key={index.toString() + item.title}
          >
            <div className="col-lg-4 ps-3">
              <Image
                src={`${item.image?.src}`}
                width={`${item.image?.width}`}
                height={`${item.image?.height}`}
                alt="city intro"
              />
            </div>
            <div className="d-flex flex-column col-lg-8">
              <span className="text-weight-700 text-4 my-2">{item.title}</span>
              <span
                style={{
                  textAlign: 'justify',
                  lineHeight: '1.8rem',
                }}
              >
                {item.description}
              </span>
            </div>
          </div>
        );
      })}
      <div className="d-flex flex-lg-row my-5 justify-content-evenly flex-md-column">
        {data.attractions.map((item, index) => {
          return (
            <div
              className="d-flex flex-column col-lg-4 bg-color-blue-light my-3 mx-2 col-md-12"
              key={index.toString() + item.description}
            >
              <span
                className="text-weight-700 text-4 pt-4"
                style={{
                  textAlign: 'center',
                }}
              >
                {item.title}
              </span>
              <span
                className="px-5 py-3"
                style={{
                  textAlign: 'justify',
                  lineHeight: '1.8rem',
                }}
              >
                {item.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
