"use client";

import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputHelpText, {
  inputStatusColor,
} from "../../components/input-help-text";

export default function TwitchBotPage(): JSX.Element {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isSubmitSuccessful },
    reset,
  } = useForm();

  // user state for form
  const [formData, setFormData] = useState(null);

  // Fetch config object from server on component load
  useEffect(() => {
    let isLoaded = true;
    axios({
      url: "/api/noalbs/config",
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

  // Reset form when config object is updated
  useEffect(() => {
    reset(formData!, { keepDirty: false });
  }, [formData, reset]);

  const submitForm = async (data: any) => {
    return axios({
      url: "/api/noalbs/config",
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
          <Label htmlFor="switcher.streamServers.0.streamServer.publisher">
            Ingest key <span className="text-red-600">*</span>
          </Label>
        </div>
        <TextInput
          id="switcher.streamServers.0.streamServer.publisher"
          {...register("switcher.streamServers.0.streamServer.publisher", {
            required: true,
          })}
          color={inputStatusColor(
            errors,
            "switcher.streamServers.0.streamServer.publisher"
          )}
        />
        <InputHelpText
          errors={errors}
          name="switcher.streamServers.0.streamServer.publisher"
        >
          The ingest key that authenticates the encoder, should begin with{" "}
          <code>publisher/stream/</code>
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
