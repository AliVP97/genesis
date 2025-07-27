//return the OffsetTop position of the services tab component
export default function getServicesTabOffsetTop(): void {
  const servicesTabComponent = document.getElementById('desktop__services');
  servicesTabComponent?.scrollIntoView({ behavior: 'smooth' });
}
