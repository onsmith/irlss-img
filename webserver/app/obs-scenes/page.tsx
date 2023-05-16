"use client";

import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputHelpText, {
  inputStatusColor,
} from "../../components/input-help-text";

export default function ObsScenesPage(): JSX.Element {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isSubmitSuccessful },
    reset,
  } = useForm();

  // Initial form data
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
    <section>
      <header>
        <h1 className="mb-6 text-4xl font-bold dark:text-white">OBS Scenes</h1>
      </header>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitForm)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="switcher.switchingScenes.normal">
              Good connection <span className="text-red-600">*</span>
            </Label>
          </div>
          <TextInput
            id="switcher.switchingScenes.normal"
            {...register("switcher.switchingScenes.normal", {
              required: true,
            })}
            type="input"
            placeholder="required"
            color={inputStatusColor(errors, "switcher.switchingScenes.normal")}
          />
          <InputHelpText errors={errors} name="switcher.switchingScenes.normal">
            Name of OBS scene to switch to if the connection to the encoder is
            good
          </InputHelpText>
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="switcher.switchingScenes.low">
              Weak connection <span className="text-red-600">*</span>
            </Label>
          </div>
          <TextInput
            id="switcher.switchingScenes.low"
            {...register("switcher.switchingScenes.low", { required: true })}
            type="input"
            placeholder="required"
            color={inputStatusColor(errors, "switcher.switchingScenes.low")}
          />
          <InputHelpText errors={errors} name="switcher.switchingScenes.low">
            Name of OBS scene to switch to if the connection to the encoder is
            weak
          </InputHelpText>
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="switcher.switchingScenes.offline">
              Disconnected <span className="text-red-600">*</span>
            </Label>
          </div>
          <TextInput
            id="switcher.switchingScenes.offline"
            {...register("switcher.switchingScenes.offline", {
              required: true,
            })}
            type="input"
            placeholder="required"
            color={inputStatusColor(errors, "switcher.switchingScenes.offline")}
          />
          <InputHelpText
            errors={errors}
            name="switcher.switchingScenes.offline"
          >
            Name of OBS scene to switch to if the connection drops
          </InputHelpText>
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="optionalScenes.starting">Starting</Label>
          </div>
          <TextInput
            id="optionalScenes.starting"
            {...register("optionalScenes.starting")}
            type="input"
          />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Name of OBS scene to switch to when the chat command{" "}
            <code>!starting</code> is used
          </p>
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="optionalScenes.ending">Ending</Label>
          </div>
          <TextInput
            id="optionalScenes.ending"
            {...register("optionalScenes.ending")}
            type="input"
          />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Name of OBS scene to switch to when the chat command{" "}
            <code>!ending</code> is used
          </p>
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="optionalScenes.privacy">Privacy</Label>
          </div>
          <TextInput
            id="optionalScenes.privacy"
            {...register("optionalScenes.privacy")}
            type="input"
          />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Name of OBS scene to switch to when the chat command{" "}
            <code>!privacy</code> is used
          </p>
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="optionalScenes.refresh">Refresh</Label>
          </div>
          <TextInput
            id="optionalScenes.refresh"
            {...register("optionalScenes.refresh")}
            type="input"
          />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Name of OBS scene to switch to when the chat command{" "}
            <code>!refresh</code> is used
          </p>
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
    </section>
  );
}
