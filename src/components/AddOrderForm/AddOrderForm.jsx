import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./AddOrderForm.module.scss";
import countries from "../../utils/countries";
import states from "../../utils/states";

const AddOrderForm = ({ submitHandler, cartItems }) => {
  // construct a regex for valid phone number
  const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
  );

  const schema = z.object({
    email: z.string().email(),
    firstName: z.string().min(1, "First name must be at least 1 character"),
    lastName: z.string().min(1, "Last name must be at least 1 character"),
    phone: z.string().regex(phoneRegex, "Must be a valid phone number"),
    streetAddress: z.string().min(1, "Street address is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    suburb: z.string().min(1, "Suburb is required"),
    postcode: z.coerce.number().min(1).max(9999),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  //   console.log(errors);
  return (
    <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
      <h3 className={styles.sectionHeader}>Contact</h3>
      <div className={styles.fieldArea}>
        <label htmlFor="email">Email Address</label>
        <div>
          <input
            className={styles.input}
            type="text"
            id="email"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <div className={styles.errorMessage}>{errors.email.message}</div>
        )}
      </div>
      <h3>Shipping Information</h3>
      <div className={styles.fieldArea}>
        <label htmlFor="firstName">First Name</label>
        <div>
          <input
            className={styles.input}
            type="text"
            id="firstName"
            {...register("firstName")}
          />
        </div>
        {errors.firstName && (
          <div className={styles.errorMessage}>{errors.firstName.message}</div>
        )}
      </div>
      <div className={styles.fieldArea}>
        <label htmlFor="lastName">Last Name</label>
        <div>
          <input
            className={styles.input}
            type="text"
            id="lastName"
            {...register("lastName")}
          />
        </div>
        {errors.lastName && (
          <div className={styles.errorMessage}>{errors.lastName.message}</div>
        )}
      </div>
      <div className={styles.fieldArea}>
        <label htmlFor="phone">Phone</label>
        <div>
          <input
            className={styles.input}
            type="text"
            id="phone"
            {...register("phone")}
          />
        </div>
        {errors.phone && (
          <div className={styles.errorMessage}>{errors.phone.message}</div>
        )}
      </div>
      <div className={styles.fieldArea}>
        <label htmlFor="streetAddress">Street Address</label>
        <div>
          <input
            className={styles.input}
            type="text"
            id="streetAddress"
            {...register("streetAddress")}
          />
        </div>
        {errors.streetAddress && (
          <div className={styles.errorMessage}>
            {errors.streetAddress.message}
          </div>
        )}
      </div>
      <div className={styles.fieldArea}>
        <label htmlFor="country">Country</label>
        <div>
          <select
            className={styles.select}
            id="country"
            {...register("country")}
          >
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        {errors.country && (
          <div className={styles.errorMessage}>{errors.country.message}</div>
        )}
      </div>
      <div className={styles.fieldArea}>
        <label htmlFor="state">State/Territory</label>
        <div>
          <select className={styles.select} id="state" {...register("state")}>
            {states.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        {errors.state && (
          <div className={styles.errorMessage}>{errors.state.message}</div>
        )}
      </div>
      <div className={styles.fieldArea}>
        <label htmlFor="suburb">Suburb</label>
        <div>
          <input
            className={styles.input}
            type="text"
            id="suburb"
            {...register("suburb")}
          />
        </div>
        {errors.suburb && (
          <div className={styles.errorMessage}>{errors.suburb.message}</div>
        )}
      </div>
      <div className={styles.fieldArea}>
        <label htmlFor="postcode">Postcode</label>
        <div>
          <input
            className={styles.input}
            type="text"
            id="postcode"
            {...register("postcode")}
          />
        </div>
        {errors.postcode && (
          <div className={styles.errorMessage}>{errors.postcode.message}</div>
        )}
      </div>
      <button className={styles.submitButton} type="submit">
        Submit
      </button>
    </form>
  );
};

export default AddOrderForm;
