import React, { FormEvent, useEffect, useState } from "react";

const SelectInput: React.FC<{
  mainText: string;
  id: string;
  columns?: string;
  valueChange: (val: number, toChange: string) => void;
}> = (props) => {
  const [value, setValue] = useState<string>(props.id + "all");
  const onValueChanged = (event: FormEvent) => {
    let myId = event.currentTarget.id;
    setValue(myId);
    let optionSelected: number = 0;
    if(myId.includes("all")){
      optionSelected = 0;
    } else if(myId.includes("reserve")){
      optionSelected = 1;
    } else if(myId.includes("lend")){
      optionSelected = 2;
    }
    props.valueChange(optionSelected, props.id);
  };
  return (
    <div className="flex flex-col items-start gap-2 animate-[fadeIn_0.4s_ease] mb-6">
      <label className="font-pop font-bold text-base leading-tight text-n-10">
        {props.mainText}
      </label>
      <div className={"grid w-full mt-2 " + props.columns}>
        <div className="flex flex-row gap-3 align-middle">
          <div className="h-6 w-6 rounded-sm flex justify-center">
            <input
              type="radio"
              id={props.id + "Yes"}
              name={props.id}
              checked={value === props.id + "all"}
              onChange={onValueChanged}
              className="self-center h-5 w-5 border-2 rounded-full appearance-none grid place-content-center
              before:bg-orange-mid before:h-3 before:w-3 before:rounded-full before:scale-0 before:checked:scale-100 before:transition-transform cursor-pointer"
            ></input>
          </div>
          <label className="font-pop text-sm leading-tight text-n-10 text-center flex items-center justify-center">
            All
          </label>
        </div>
        <div className="flex flex-row gap-3 align-middle">
          <div className="h-6 w-6 rounded-sm flex justify-center">
            <input
              type="radio"
              id={props.id + "No"}
              name={props.id}
              checked={value === props.id + "reserve"}
              onChange={onValueChanged}
              className="self-center h-5 w-5 border-2 rounded-full appearance-none grid place-content-center
              before:bg-orange-mid before:h-3 before:w-3 before:rounded-full before:scale-0 before:checked:scale-100 before:transition-transform cursor-pointer"
            ></input>
          </div>
          <label className="font-pop text-sm leading-tight text-n-10 text-center flex items-center justify-center">
            Reservations
          </label>
        </div>
        <div className="flex flex-row gap-3 align-middle">
          <div className="h-6 w-6 rounded-sm flex justify-center">
            <input
              type="radio"
              id={props.id + "xd"}
              name={props.id}
              checked={value === props.id + "lend"}
              onChange={onValueChanged}
              className="self-center h-5 w-5 border-2 rounded-full appearance-none grid place-content-center
              before:bg-orange-mid before:h-3 before:w-3 before:rounded-full before:scale-0 before:checked:scale-100 before:transition-transform cursor-pointer"
            ></input>
          </div>
          <label className="font-pop text-sm leading-tight text-n-10 text-center flex items-center justify-center">
            Lendings
          </label>
        </div>
      </div>
    </div>
  );
};

export default SelectInput;
