/**
 * MeetingDateField component: displays a date picker for selecting a meeting date.
 */

import { EuiDatePicker, EuiFormRow } from "@elastic/eui";
import moment from "moment";

/**
 * MeetingDateField props:
 * - selected: the currently selected date
 * - setStartDate: a function to update the selected date
 */
export default function MeetingDateField({
  selected,
  setStartDate,
}: {
  selected: moment.Moment;
  setStartDate: React.Dispatch<React.SetStateAction<moment.Moment>>;
}) {
  /**
   * handleChange function: updates the selected date when the user selects a new date.
   * @param {moment.Moment} date - the selected date
   */
  const handleChange = (date: moment.Moment) => {
    setStartDate(date);
  };

  /**
   * Render the MeetingDateField component.
   */
  return (
    <EuiFormRow>
      <EuiDatePicker selected={selected} onChange={handleChange} />
    </EuiFormRow>
  );
}
