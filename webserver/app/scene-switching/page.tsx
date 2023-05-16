"use client";

import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputHelpText, {
  inputStatusColor,
} from "../../components/input-help-text";

export default function SceneSwitchingPage(): JSX.Element {
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
    <form onSubmit={handleSubmit(submitForm)}>
      <section>
        <header>
          <h2 className="mb-6 text-4xl font-bold dark:text-white">
            Scene Switching
          </h2>
        </header>

        <div className="flex flex-col gap-4">
          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("switcher.bitrateSwitcherEnabled")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Automatically switch scenes
              </span>
            </label>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Automatically switch the active OBS scene based on the current
              bitrate and latency
            </p>
          </div>

          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("switcher.onlySwitchWhenStreaming")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Only automatically switch scenes when live
              </span>
            </label>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Only automatically switch scenes when the stream is live
            </p>
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="switcher.retryAttempts">
                Scene switch delay <span className="text-red-600">*</span>
              </Label>
            </div>
            <TextInput
              id="switcher.retryAttempts"
              type="number"
              {...register("switcher.retryAttempts", {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
              color={inputStatusColor(errors, "switcher.retryAttempts")}
            />
            <InputHelpText errors={errors} name="switcher.retryAttempts">
              Number of seconds after a network change the stream should be
              monitored before the scene is switched
            </InputHelpText>
          </div>

          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("switcher.instantlySwitchOnRecover")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Recover stream immediately
              </span>
            </label>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Skip the <em>scene switch delay</em> when the network is improving
              and switch back immediately to the good connection scene
            </p>
          </div>

          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("switcher.autoSwitchNotification")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Post a notification in chat when switching scenes
              </span>
            </label>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Post a message in chat whenever the scene is switched
              automatically
            </p>
          </div>
        </div>
      </section>

      <section className="pt-6">
        <header>
          <h2 className="mb-3 text-2xl font-bold dark:text-white">
            Good connection
          </h2>
        </header>

        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="switcher.switchingScenes.normal">
                Scene name <span className="text-red-600">*</span>
              </Label>
            </div>
            <TextInput
              id="switcher.switchingScenes.normal"
              {...register("switcher.switchingScenes.normal", {
                required: true,
              })}
              type="input"
              placeholder="required"
              color={inputStatusColor(
                errors,
                "switcher.switchingScenes.normal"
              )}
            />
            <InputHelpText
              errors={errors}
              name="switcher.switchingScenes.normal"
            >
              Name of the OBS scene to be shown if the connection to the encoder
              is good
            </InputHelpText>
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="switcher.triggers.low">Minimum bitrate</Label>
            </div>
            <TextInput
              id="switcher.triggers.low"
              type="number"
              {...register("switcher.triggers.low", {
                min: 1,
                valueAsNumber: true,
              })}
              color={inputStatusColor(errors, "switcher.triggers.low")}
              defaultValue={800}
            />
            <InputHelpText errors={errors} name="switcher.triggers.low">
              If the bitrate of the connection to the encoder is below this
              value in kbps, OBS will switch to the weak connection scene
            </InputHelpText>
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="switcher.triggers.rtt">Minimum latency</Label>
            </div>
            <TextInput
              id="switcher.triggers.rtt"
              type="number"
              {...register("switcher.triggers.rtt", {
                min: 1,
                valueAsNumber: true,
              })}
              color={inputStatusColor(errors, "switcher.triggers.rtt")}
              defaultValue={2500}
            />
            <InputHelpText errors={errors} name="switcher.triggers.rtt">
              If the latency (round-trip time) to the encoder exceeds this value
              in milliseconds, OBS will switch to the weak connection scene
            </InputHelpText>
          </div>
        </div>
      </section>

      <section className="pt-6">
        <header>
          <h2 className="mb-3 text-2xl font-bold dark:text-white">
            Weak connection
          </h2>
        </header>

        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="switcher.switchingScenes.low">
                Scene name <span className="text-red-600">*</span>
              </Label>
            </div>
            <TextInput
              id="switcher.switchingScenes.low"
              {...register("switcher.switchingScenes.low", {
                required: true,
              })}
              type="input"
              placeholder="required"
              color={inputStatusColor(errors, "switcher.switchingScenes.low")}
            />
            <InputHelpText errors={errors} name="switcher.switchingScenes.low">
              Name of the OBS scene to be shown if the connection to the encoder
              is weak
            </InputHelpText>
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="switcher.triggers.offline">Minimum bitrate</Label>
            </div>

            <TextInput
              id="switcher.triggers.offline"
              type="number"
              {...register("switcher.triggers.offline", {
                min: 1,
                valueAsNumber: true,
              })}
              color={inputStatusColor(errors, "switcher.triggers.offline")}
              placeholder="None"
            />
            <InputHelpText errors={errors} name="switcher.triggers.offline">
              If the bitrate of the connection to the encoder is below this
              value in kbps, OBS will be switched to the disconnected scene
            </InputHelpText>
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="switcher.triggers.rtt_offline">
                Minimum latency
              </Label>
            </div>
            <TextInput
              id="switcher.triggers.rtt_offline"
              type="number"
              {...register("switcher.triggers.rtt_offline", {
                min: 1,
                valueAsNumber: true,
              })}
              color={inputStatusColor(errors, "switcher.triggers.rtt_offline")}
              defaultValue={2500}
            />
            <InputHelpText errors={errors} name="switcher.triggers.rtt_offline">
              If the latency (round-trip time) to the encoder exceeds this value
              in milliseconds, OBS will be switched to the disconnected scene
            </InputHelpText>
          </div>
        </div>
      </section>

      <section className="pt-6">
        <header>
          <h2 className="mb-3 text-2xl font-bold dark:text-white">
            Disconnected
          </h2>
        </header>

        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="switcher.switchingScenes.offline">
                Scene name <span className="text-red-600">*</span>
              </Label>
            </div>
            <TextInput
              id="switcher.switchingScenes.offline"
              {...register("switcher.switchingScenes.offline", {
                required: true,
              })}
              type="input"
              placeholder="required"
              color={inputStatusColor(
                errors,
                "switcher.switchingScenes.offline"
              )}
            />
            <InputHelpText
              errors={errors}
              name="switcher.switchingScenes.offline"
            >
              Name of the scene to be shown if the connection to the encoder
              drops
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
        </div>
      </section>
    </form>
  );
}
