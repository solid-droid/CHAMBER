import './Dropdown.css';
import { Select, createOptions  } from "@thisbeyond/solid-select";
function Dropdown(props) {
    //create group workaround from solid-select.js library
    const createGroupedOptions = (groups) => {
      const values = groups.reduce((values, group) => {
        values.push(
          ...group.options.map((item) => ({ ...item, group: group.name }))
        );
        return values;
      }, []);
    
      const props = createOptions(values, { key: "name" });
      const originalOptions = props.options;
    
      props.options = (inputValue) => {
        const options = originalOptions(inputValue);
    
        const grouped = options.reduce((result, item) => {
          const group = item.value.group;
          if (!result.has(group)) result.set(group, []);
          result.get(group).push(item);
          return result;
        }, new Map());
    
        const groupedOptions = [];
        for (const [groupName, options] of grouped.entries()) {
          groupedOptions.push({
            label: <span class="text-sm uppercase">{groupName}</span>,
            value: groupName,
            disabled: true,
          });
          groupedOptions.push(...options);
        }
    
        return groupedOptions;
      };
    
      return props;
    };

    const Optionprop = createGroupedOptions(props.options);
  return (
    <Select 
              {...Optionprop}
              class="customSelect"
              value={props.value} 
              onFocus={e => props.onFocus(e)}
              onBlur={e => props.onBlur(e)}
              onChange={e => props.onChange(e)}
    />
  )
}

export default Dropdown