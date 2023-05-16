"use client";

import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputHelpText, {
  inputStatusColor,
} from "../../components/input-help-text";

export default function TwitchAuthPage(): JSX.Element {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isSubmitSuccessful },
    reset,
  } = useForm();

  // user state for form
  const [formData, setFormData] = useState(null);

  // Fetch env object from server on component load
  useEffect(() => {
    let isLoaded = true;
    axios({
      url: "/api/noalbs/env",
      method: "GET",
    }).then((response) => {
      if (isLoaded) {
        setFormData(response.data);
      }
    });
    return () => {
      isLoaded = false;
    };
  }, []);

  // Reset form when env object is updated
  useEffect(() => {
    reset(formData!, { keepDirty: false });
  }, [formData, reset]);

  const submitForm = async (data: any) => {
    return axios({
      url: "/api/noalbs/env",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    }).then((response) => {
      // TODO abort if component is unmounted
      setFormData(response.data);
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="TWITCH_BOT_USERNAME">
            Twitch username <span className="text-red-600">*</span>
          </Label>
        </div>
        <TextInput
          id="TWITCH_BOT_USERNAME"
          {...register("TWITCH_BOT_USERNAME", { required: true })}
          color={inputStatusColor(errors, "TWITCH_BOT_USERNAME")}
          type="input"
          placeholder="Twitch bot username"
        />
        <InputHelpText errors={errors} name="TWITCH_BOT_USERNAME">
          The username of your Twitch bot or main account
        </InputHelpText>
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="TWITCH_BOT_OAUTH">
            Twitch OAuth token <span className="text-red-600">*</span>
          </Label>
        </div>
        <TextInput
          id="TWITCH_BOT_OAUTH"
          {...register("TWITCH_BOT_OAUTH", {
            required: true,
            pattern: /^oauth:.+$/,
          })}
          color={inputStatusColor(errors, "TWITCH_BOT_OAUTH")}
          type="password"
          placeholder="oauth:xxxxxxxxxxxxxxxx"
        />
        <InputHelpText errors={errors} name="TWITCH_BOT_OAUTH">
          The OAuth token for your Twitch bot or main account
        </InputHelpText>
      </div>

      <div>
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="btn btn-primary mr-1"
        >
          {isSubmitting && (
            <span className="spinner-border spinner-border-sm mr-1"></span>
          )}
          {isSubmitting
            ? "Saving"
            : isSubmitSuccessful || !isDirty
            ? "Saved"
            : "Save"}
        </Button>
      </div>
    </form>
  );
}
