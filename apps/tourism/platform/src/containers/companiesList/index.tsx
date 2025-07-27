import style from './style.module.scss';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { ArrowDownIcon } from 'assets/icons';
import Checkbox from 'components/checkbox';
import Image from 'next/image';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { customLoader } from 'utils/helpers/imageLoader';
import { CompaniesListPropsType, CompaniesListStateMemberType } from './types';

const CompaniesList = ({
  title,
  state,
  onChange,
  showTotal = true,
  showDropdown = true,
}: CompaniesListPropsType) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const handleChange = (e: CompaniesListStateMemberType) => {
    const newState = cloneDeep(state);
    const newStateNewMemberIndex = newState.indexOf(
      newState.find((m) => m.value === e.value) as CompaniesListStateMemberType,
    );
    newState[newStateNewMemberIndex] = e;
    onChange({ name: 'companiesList', state: newState });
  };

  return (
    <Accordion>
      <AccordionItem dangerouslySetExpanded={isExpanded}>
        <AccordionItemHeading
          onClick={() => {
            showDropdown && setIsExpanded(!isExpanded);
          }}
        >
          <AccordionItemButton className="d-flex">
            <div className={style['filter__subTitle-airline']}>
              {title}
              {showTotal && <span className="me-2">({state?.length} مورد)</span>}
            </div>
            {showDropdown && <ArrowDownIcon className="me-auto" />}
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel className="p-0">
          <>
            <div>
              {state?.map((stateMember, index) => {
                return (
                  <div
                    key={stateMember.value + index.toString()}
                    onClick={() => {
                      handleChange({
                        ...stateMember,
                        isSelected: !stateMember.isSelected,
                      });
                    }}
                    className={style['filter__airlineItem']}
                  >
                    <Checkbox checked={stateMember.isSelected} style={{ borderColor: '#065BAA' }} />
                    <div
                      className={
                        stateMember.isSelected
                          ? style['filter__airlineItem-wrapper--active']
                          : style['filter__airlineItem-wrapper']
                      }
                    >
                      {!!stateMember.logo && (
                        <Image
                          loader={customLoader}
                          src={stateMember.logo}
                          alt="logo"
                          width="32px"
                          height="32px"
                          quality={100}
                          unoptimized
                          className={'rounded-circle'}
                        />
                      )}

                      <span>{stateMember.title}</span>
                      <span className="me-auto">{stateMember.info}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
};

export { CompaniesList };
