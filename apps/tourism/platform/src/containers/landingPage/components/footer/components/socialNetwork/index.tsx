type TFooterSocialNetwork = { data: { icon: JSX.Element; link: string }[] };

const FooterSocialNetwork = ({ data }: TFooterSocialNetwork) => {
  return (
    <div className="mx-auto ms-lg-0 d-block d-lg-flex flex-lg-column justify-content-lg-center mb-lg-3">
      <div>
        <p dir={'rtl'} className="text-center text-2 text-white">
          ما را در شبکه های اجتماعی دنبال کنید.
        </p>
      </div>
      <div className="d-flex justify-content-center align-items-center justify-content-lg-center mt-3 my-lg-0 gap-3">
        {data.map((item, index) => {
          return (
            <a target="_blank" href={item.link} rel="noreferrer" key={index}>
              {item.icon}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default FooterSocialNetwork;
